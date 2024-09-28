"use client";

import Image from "next/image";
import Modal from "./Modal";

interface ImageOpenerProps {
  image: any;
  isOpen: boolean;
  onClose: () => void;
}

const ImageOpener: React.FC<ImageOpenerProps> = ({
  image,
  isOpen,
  onClose,
}) => {
  if (!image) onClose();
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Image
        src={image}
        alt="Image"
        width={500}
        height={500}
        layout="responsive"
        objectFit="cover"
        objectPosition="start"
        priority={true}
        className="mt-8 rounded-lg max-h-[80vh] object-scale-down"
        draggable={false}
      />
    </Modal>
  );
};

export default ImageOpener;
