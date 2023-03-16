import Image from "next/image";

export const DestinyCharacterClassIconBackground = () => (
  <div className="fixed flex inset-0 -z-10 justify-center items-center opacity-10">
    <Image
      src="/destiny-icons/destiny.svg"
      width={256}
      height={256}
      alt="Destiny character class type"
    />
  </div>
);
