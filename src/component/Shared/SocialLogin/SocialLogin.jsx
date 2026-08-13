import { FcGoogle } from "react-icons/fc";

const SocialLogin = () => {

    return (
        <button
            type="button"
            className="w-full border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
          >
            <FcGoogle className="text-lg" />
            Continue with Google
          </button>
    );
};

export default SocialLogin;