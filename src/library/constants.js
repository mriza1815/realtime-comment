export const socialLoginTitle = "Please login with the following options";
export const emptyCommentList = "Not found any comment yet!";
export const authInfoMsg = "Please login for write comments!";
export const emptyCommentMsg = "Please write any text!";
export const restrictedWordWarning =
  "You can't send this comment because includes restricted words!";

export const logoutSuccess = "Logout successfully";
export const loginSuccessMsg = "Login process successfully completed";
export const registerSuccessMsg = "Register process successfully completed";
export const loginErrorMsg = "Something went wrong! Please try again";
export const commentSuccessMsg = "Your comment sent successfully!";
export const successMsg = "Process successfull!";
export const blockedMsg = "You are blocked!";

export const facebookLoginEnabled = false;
export const twitterLoginEnabled = false;
export const attachImgEnabled = true;

export const socialEmailButtonConfig = {
  text: "Email",
  icon: "envelope-square",
  iconFormat: (name) => `fa fa-${name}`,
  style: { background: "#3b5998" },
  activeStyle: { background: "#293e69" },
};

export const adminEmails = [
  "turan@turan.com",
  "mriza1815@gmail.com",
  "turangurler@gmail.com",
  "vkaraeren@gmail.com",
];

export const prepareUserData = (data) => ({
  name: data.user.displayName || data.user.name || "Noname User",
  displayName: makeShowName(
    data.user.displayName || data.user.name || "Noname User"
  ),
  token:
    (data.credential && data.credential.accessToken) ||
    data.user.refreshToken ||
    null,
  email: data.user.email || null,
  uid: data.user.uid || null,
  isAdmin: adminEmails.includes(data.user.email),
  avatar: data.user?.photoURL ?? "",
  avatarId: data?.avatarId ?? generateRandomAvatarId(),
});

export const prepareUserDataWithEmail = (user, name = "") => ({
  name: user?.displayName || user?.name || name || "Noname User",
  displayName: makeShowName(
    user?.displayName || user?.name || name || "Noname User"
  ),
  token: user?.refreshToken || user?.accessToken || null,
  email: user?.email ?? null,
  uid: user?.uid ?? null,
  isAdmin: adminEmails.includes(user?.email),
  avatar: user?.photoURL ?? "",
  avatarId: user?.avatarId ?? generateRandomAvatarId(),
});

const makeShowName = (name) => {
  if (!name) return "Noname U.";
  let arr = name.split(" ");
  return arr.length > 1 ? `${arr[0]} ${arr[1].charAt(0)}.` : name;
};

export const generateRandomAvatarId = () =>
  Math.floor(Math.random() * (8 - 1 + 1) + 1);
