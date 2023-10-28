import Link from "next/link";

function Topbar () {
    return (
        <nav className="topbar">
            <Link href="/" className="flex item-center gap-4">
                {/* <Image src="/logo.svg" alt="logo" width={28} height={28} /> */}
            
            </Link>

        </nav>
    )
}

export default Topbar;