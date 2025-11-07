import HeaderComponent from "../components/HeaderComponent/HeaderComponent";
import FooterComponent from "../components/FooterComponent/FooterComponent";

function HigherOrderComponent(WrapperComponent) {
  return function InnerComponent(props) {
    return (
      <>
        <HeaderComponent />
        <WrapperComponent {...props} />
        <FooterComponent />
      </>
    );
  };
}

export default HigherOrderComponent;
