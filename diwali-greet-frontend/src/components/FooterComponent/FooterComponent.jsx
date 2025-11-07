function FooterComponent() {
  return (
    <footer
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(5px)",
        color: "#555",
        padding: "20px",
        textAlign: "center",
        marginTop: "auto",
        width: "100%",
        boxSizing: "border-box", 
      }}
    >
      © {new Date().getFullYear()} Made with ❤️ for a Joyous Diwali
    </footer>
  );
}

export default FooterComponent;
