import { FcGoogle } from "react-icons/fc";
import useAuth from "../../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import toast from "react-hot-toast";
import useUsers from "../../../hooks/useUsers";

const SocialLogin = () => {
  const { googleLogin, loading, setLoading } = useAuth();
  const {createUser: createDBUser, isCreating}= useUsers();

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleGoogleLogin = async () => {
    try {
 
      // google auth call
      const result = await googleLogin();
      const loggedUser = result?.user;

      // user info object
      const userInfo = {
        uid: loggedUser?.uid || "",
        name: loggedUser?.displayName || "",
        email: loggedUser?.email || "",
        photoURL: loggedUser?.photoURL || "",
        role: "user",
        status: "active",
        isVerified: loggedUser?.emailVerified ?? true,
        preferences: {
          currency: "BDT",
        },
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };

      // save to db using tanstack query mutation
      await createDBUser(userInfo);

      toast.success(`${userInfo?.name} Successfully logged in with Google!`, {
        position: "bottom-center",
      });
      navigate(from, { replace: true });
    } catch (error) {
      setLoading(false);
      console.log("Google Login Error: ", error.message);
      toast.error(error.message || "Failed to sign in with Google.", {
        position: "bottom-center",
      });
    }
  };

  const isSubmitting = loading || isCreating;

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={loading}
      type="button"
      className="w-full border border-gray-200 rounded-xl py-2.5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition cursor-pointer"
    >
      <FcGoogle className="text-lg" />
      {isSubmitting ? (
        <span className="animate-pulse">Signing in...</span>
      ) : (
        "Continue with Google"
      )}
    </button>
  );
};

export default SocialLogin;
