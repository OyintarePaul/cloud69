import ErrorIcon from "@/assets/icons/error-icon.png";
import Empty from "./Empty";
const PageError = () => {
  return (
    <Empty
      iconSrc={ErrorIcon}
      title="Oops! Something went wrong."
      subtitle="Try refreshing the page"
    />
  );
};
export default PageError;
