import { useState, useEffect, useRef } from 'react';
import { Dumbbell } from 'lucide-react';

const ExerciseGif = ({ src, alt, fallbackImage, className = "w-full h-48 object-contain" }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFallback, setShowFallback] = useState(false);
  const [proxyIndex, setProxyIndex] = useState(0);
  const timeoutRef = useRef(null);
  const imgRef = useRef(null);

  // Proxies que mantienen los GIFs animados
  const proxies = [
    // Proxy principal - images.weserv.nl (rápido y mantiene animación)
    (url) => `https://images.weserv.nl/?url=${encodeURIComponent(url)}&output=gif&n=-1`,
    // Proxy alternativo - wsrv.nl (similar pero diferente dominio)
    (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=gif&n=-1`,
    // Directo (por si acaso funciona)
    (url) => url,
  ];

  useEffect(() => {
    // Reset states cuando cambia la URL fuente
    setIsLoading(true);
    setShowFallback(false);
    setProxyIndex(0);

    // Intentar con el primer proxy
    const proxiedUrl = proxies[0](src);
    console.log(`🔄 Cargando GIF con proxy 1/${proxies.length}: ${src.substring(0, 50)}...`);
    setImageUrl(proxiedUrl);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [src]);

  // Effect para manejar timeout de cada intento
  useEffect(() => {
    if (isLoading && proxyIndex >= 0 && proxyIndex < proxies.length) {
      // Timeout de 6 segundos para este proxy
      timeoutRef.current = setTimeout(() => {
        if (isLoading) {
          console.log(`⏱️ Timeout del proxy ${proxyIndex + 1}, intentando siguiente...`);
          tryNextProxy();
        }
      }, 6000);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [proxyIndex, isLoading]);

  const tryNextProxy = () => {
    const nextIndex = proxyIndex + 1;

    if (nextIndex < proxies.length) {
      // Intentar con el siguiente proxy
      console.log(`🔄 Intentando proxy ${nextIndex + 1}/${proxies.length}`);
      setProxyIndex(nextIndex);
      setImageUrl(proxies[nextIndex](src));
    } else if (fallbackImage) {
      // Ya probamos todos los proxies, usar imagen de fallback
      console.log('⚠️ Todos los proxies fallaron, usando imagen de fallback');
      setImageUrl(fallbackImage);
      setIsLoading(false);
    } else {
      // No hay fallback, mostrar placeholder
      console.log('❌ No hay fallback disponible, mostrando placeholder');
      setShowFallback(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    console.log('✅ Imagen cargada exitosamente');
    setIsLoading(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleError = () => {
    console.log('❌ Error cargando imagen, intentando siguiente opción...');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Intentar siguiente proxy inmediatamente en vez de esperar el timeout
    tryNextProxy();
  };

  // Si se debe mostrar fallback (placeholder)
  if (showFallback) {
    return (
      <div className={`relative ${className.includes('h-') ? '' : 'h-48'} bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg overflow-hidden flex flex-col items-center justify-center`}>
        <Dumbbell className="h-16 w-16 text-primary-300 mb-2" />
        <p className="text-sm text-gray-500 font-medium px-4 text-center">{alt}</p>
        <p className="text-xs text-gray-400 mt-1">Vista previa no disponible</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className.includes('h-') ? '' : 'h-48'} bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center`}>
      {/* Skeleton loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <Dumbbell className="h-12 w-12 text-gray-400" />
        </div>
      )}

      <img
        ref={imgRef}
        src={imageUrl}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default ExerciseGif;
