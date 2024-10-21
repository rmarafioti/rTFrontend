import TattooCard from "./TattooCard";

export default function Drop() {
  return (
    <article className="pageSetup">
      <h1>Drop</h1>
      <p>the main section where the user will enter their daily drop</p>
      <form className="dropForm">
        <label className="labelName">Date:</label>
        <input
          className="dropFormInput"
          type="date"
          name="drop_date"
          aria-label="drop_date"
        />
        <TattooCard />
        <input
          className="dropFormInput"
          id="submitDrop"
          type="submit"
          value="Submit Drop"
          aria-label="form_submit"
        />
      </form>
    </article>
  );
}
