import React, { useState, useEffect } from 'react';
import { ProductColor } from '../types';
import { getIsolatedProductColorImage } from '../utils/recolorImage';

interface ProductImageViewerProps {
  baseImage: string;
  productName: string;
  selectedColor: ProductColor;
  defaultColor?: ProductColor;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export const ProductImageViewer: React.FC<ProductImageViewerProps> = ({
  baseImage,
  productName,
  selectedColor,
  defaultColor,
  className = 'w-full h-full object-cover object-center',
  loading = 'lazy',
}) => {
  const [recoloredImage, setRecoloredImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Determine if the selected color is the original base color of the photo
  const isDefault =
    defaultColor &&
    (selectedColor.name.toLowerCase() === defaultColor.name.toLowerCase() ||
      selectedColor.hex.toLowerCase() === defaultColor.hex.toLowerCase());

  useEffect(() => {
    // If buyer selected the base/default color of the photo, show original image without alteration
    if (isDefault) {
      setRecoloredImage(null);
      setIsProcessing(false);
      return;
    }

    let isMounted = true;
    setIsProcessing(true);

    getIsolatedProductColorImage({
      imageSrc: baseImage,
      targetHex: selectedColor.hex,
      targetName: selectedColor.name,
    })
      .then((result) => {
        if (isMounted) {
          if (result) {
            setRecoloredImage(result);
          }
          setIsProcessing(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsProcessing(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [baseImage, selectedColor.hex, selectedColor.name, isDefault]);

  // If default, use original baseImage.
  // Otherwise, use recoloredImage (where only the garment changed color and background remained intact).
  // Fallback to baseImage if processing hasn't finished yet.
  const displaySrc = isDefault ? baseImage : (recoloredImage || baseImage);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <img
        src={displaySrc}
        alt={`${productName} - ${selectedColor.name}`}
        referrerPolicy="no-referrer"
        loading={loading}
        className={`${className} transition-all duration-300 ${
          isProcessing && !recoloredImage ? 'opacity-90 blur-[0.3px]' : 'opacity-100'
        }`}
      />
    </div>
  );
};
