import Image from "next/image"
import Link from "next/link"
import AnhBia from "../../../components/profile/anhBia"
import Header from "../../../components/header/header"
import Body from "../../../components/profile/body"
export default function Profile() {
    return (
        <>
            <Header></Header>
            <div className="block">
                <AnhBia></AnhBia>
            </div>

            <Body></Body>
        </>
    )
}