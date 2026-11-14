import Lightbox, { type SlideImage } from "yet-another-react-lightbox";
import Counter from "yet-another-react-lightbox/plugins/counter";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";

interface PosterLightboxProps {
  open: boolean;
  index: number;
  onClose: () => void;
  slides: SlideImage[];
}

/** Full-screen image viewer (keyboard, swipe and pinch support). Loaded on demand. */
export default function PosterLightbox({ open, index, onClose, slides }: PosterLightboxProps) {
  return (
    <Lightbox
      open={open}
      index={index}
      close={onClose}
      slides={slides}
      plugins={[Counter]}
      carousel={{ finite: false, preload: 2 }}
      controller={{ closeOnBackdropClick: true }}
      styles={{ container: { backgroundColor: "rgba(10, 4, 4, 0.94)" } }}
    />
  );
}
