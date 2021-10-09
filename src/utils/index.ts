import { ApolloError } from "@apollo/client"
import { toast, ToastOptions } from "react-toastify";

export const getErrorCode = (error: ApolloError): string => {
  let code = 'unknown';
  if (error.graphQLErrors.length > 0) {
    const extensions = error.graphQLErrors[0].extensions;
    code = extensions ? extensions['code'] : code;
  }
  return code;
}

const defaultToastOptions: ToastOptions = {
  position: "top-right",
  autoClose: 2500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
}

export const _toast = {
  info: (message: string) => toast.info(message, defaultToastOptions),
  success: (message: string) => toast.success(message, defaultToastOptions),
  warning: (message: string) => toast.warning(message, defaultToastOptions),
  error: (message: string) => toast.error(message, defaultToastOptions),
};