export default function TattooCard() {
  return (
    <article className="pageSetup">
      <h1>Service</h1>
      <form className="serviceForm">
        <label className="labelName">Description: </label>
        <input
          className="serviceFormInput"
          type="text"
          name="user_service"
          aria-label="user_service"
        />
        <div>
          <label className="labelName">Cash: </label>
          <input
            className="serviceFormInput"
            id="cashInput"
            type="number"
            name="service_cash"
            aria-label="service_cash"
          />
          <label className="labelName">Credit: </label>
          <input
            className="serviceFormInput"
            id="creditInput"
            type="number"
            name="service_credit"
            aria-label="service_credit"
          />
        </div>
        <div>
          <label className="labelName">Deposit: </label>
          <input
            className="serviceFormInput"
            id="depositInput"
            type="number"
            name="service_deposit"
            aria-label="service_deposit"
          />
          <label className="labelName">Gift Certificate: </label>
          <input
            className="serviceFormInput"
            id="giftcertInput"
            type="number"
            name="service_giftcert"
            aria-label="service_giftcert"
          />
        </div>
        <input
          className="serviceFormInput"
          id="addService"
          type="submit"
          value="Add Service"
          aria-label="form_submit"
        />
      </form>
    </article>
  );
}
