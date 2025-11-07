import HOC from "../hoc/HigherOrderComponent";

function SecondComponent() {
  return <h3>Second !!!</h3>;
}

export default HOC(SecondComponent);
