
import { Loader2 } from 'lucide-react'; // 假設使用 lucide-react 作為 Loading 圖標

export default function Loading() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <p className="mt-4 text-lg">正在登入...</p>
            </div>
        </>
    );
}


