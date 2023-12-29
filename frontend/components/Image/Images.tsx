import Image from "next/image";
interface image {
    link: string
}

export const Images: React.FC<image> = ({ link }) => {
    return (
        <>
            <Image
                className="w-full h-full border box-border"
                src={link ? link : "/images/user.png"}
                objectFit="cover"
                fill={true}
                quality={100}
                alt="avatar"
                onError={(e: any) => {
                    e.target.onerror = null;
                    e.target.setsrc = "/images/user.png";
                }}
            />
        </>
    )
};
