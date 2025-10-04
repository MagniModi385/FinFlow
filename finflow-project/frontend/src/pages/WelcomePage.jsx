import { Link } from 'react-router-dom';

function WelcomePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full mx-auto text-center">
                <div className="mb-10">
                    <h1 className="text-6xl font-bold text-blue-600">FinFlow</h1>
                    <p className="mt-3 text-lg text-gray-500">Your Streamlined Expense Management</p>
                </div>

                <div className="space-y-4">
                    <Link
                        to="/signin"
                        className="block w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/signup"
                        className="block w-full py-4 px-4 bg-gray-700 hover:bg-gray-800 text-white font-bold text-lg rounded-lg shadow-md transition-transform transform hover:scale-105"
                    >
                        Create a New Company
                    </Link>
                </div>

                <div className="mt-8">
                    <Link to="/dev-login" className="text-sm text-gray-500 hover:text-blue-600 hover:underline">
                        Developer Quick Login
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default WelcomePage;