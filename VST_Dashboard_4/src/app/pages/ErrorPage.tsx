import { useRouteError, Link } from "react-router";
import { Button } from "../components/ui/button";
import { Home, AlertCircle, ArrowLeft } from "lucide-react";

export default function ErrorPage() {
    const error: any = useRouteError();
    console.error(error);

    const is404 = error?.status === 404;

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-sans">
            <div className="max-w-md w-full text-center">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                </div>

                <h1 className="text-6xl font-black text-gray-900 mb-4">{is404 ? "404" : "Oops!"}</h1>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {is404 ? "Page Not Found" : "Something went wrong"}
                </h2>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    {is404
                        ? "The page you are looking for might have been removed, had its name changed, or is temporarily unavailable."
                        : (error?.statusText || error?.message || "An unexpected error occurred while processing your request.")
                    }
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        className="bg-[#006847] hover:bg-[#005538] text-white px-8 py-6 rounded-2xl shadow-lg transition-all hover:scale-105"
                    >
                        <Link to="/" className="flex items-center gap-2">
                            <Home className="w-5 h-5" />
                            Return Home
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                        className="border-gray-300 px-8 py-6 rounded-2xl hover:bg-gray-100 transition-all hover:scale-105"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </Button>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        AbySmart Intelligence Hub • Error Reporter
                    </p>
                </div>
            </div>
        </div>
    );
}
