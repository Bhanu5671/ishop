import { AiOutlineCloudDownload } from "react-icons/ai"

const Loader = () => (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div
            role="status"
            aria-live="polite"
            aria-busy="true"
            className="relative flex flex-col items-center gap-5 rounded-xl border border-[#e2e2e2] bg-card/80 p-8  backdrop-blur"
        >
            <div className="relative">
                <div className="w-16 h-16 border-3 text-gray-500 border-t-transparent rounded-full animate-spin"></div>
                {/* <AiOutlineCloudDownload aria-hidden className="absolute inset-0 m-auto h-6 w-6 md:h-7 md:w-7 text-primary" /> */}
            </div>

            <span className="text-center text-xs sm:text-sm md:text-base font-medium uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                FETCHING DATA....
            </span>

            <span className="sr-only">Loading, fetching data</span>
        </div>
    </div>
)

export default Loader
