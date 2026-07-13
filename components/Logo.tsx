import Image from "next/image";

type LogoProps = {
  /** Lacivert zemin üzerinde (footer vb.) açık renk varyant. */
  onDark?: boolean;
};

/**
 * Kurumsal logo — arka plan tamamen şeffaf.
 * logo.png: orijinal (lacivert), açık zeminde kullanılır.
 * logo-light.png: beyaz varyant (turuncu vurgu korunur), koyu zeminde
 * kullanılır; iki görsel arasında geçiş CSS ile (dark:) yapılır.
 */
export default function Logo({ onDark = false }: LogoProps) {
  const sizing = "h-10 w-auto sm:h-11";

  if (onDark) {
    return (
      <Image
        src="/logo-light.png"
        alt="Egehan Lojistik"
        width={415}
        height={118}
        className={sizing}
      />
    );
  }

  return (
    <span className="inline-flex items-center">
      <Image
        src="/logo.png"
        alt="Egehan Lojistik"
        width={415}
        height={118}
        priority
        className={`${sizing} dark:hidden`}
      />
      <Image
        src="/logo-light.png"
        alt=""
        aria-hidden="true"
        width={415}
        height={118}
        className={`${sizing} hidden dark:block`}
      />
    </span>
  );
}
