import { GlobeAltIcon } from "@heroicons/react/24/solid";
import { lusitana } from "./fonts";



export default function AcmeLogo(){
    return (
        <div className={`${lusitana.className} flex flex-row items-center loading-none text-white`}>
            <GlobeAltIcon className="h-12 w-12 rotate-[15deg]"/>
            <div className="text-[44px]">
                Acme
            </div>
        </div>
    )
}