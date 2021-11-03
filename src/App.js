import "./App.css";
import Container from "./components/Container";

/* const db = firebase.firestore();

db.collection("companies")
  .get()
  .then((doc) => {
    console.log(doc.data());
  }); */

function App() {
  return (
    <div className='App'>
      <Container />
    </div>
  );
}

export default App;
