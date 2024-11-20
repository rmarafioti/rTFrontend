import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import {
  useGetMemberQuery,
  useMemberCreateServiceMutation,
  useMemberUpdateDropMutation,
  useMemberUpdateInfoMutation,
  useOwnerUpdateTotalMutation,
} from "../features/members/membersSlice";
import styles from "../styling/drop.module.css";

export default function Drop({ dropId }) {
  console.log("Received dropId in Drop:", dropId);

  const { data: member } = useGetMemberQuery();
  const memberId = member?.id;

  const [addedService, setAddedService] = useState([]);
  const [date, setDate] = useState("");
  const [createService] = useMemberCreateServiceMutation();
  const [updateDrop] = useMemberUpdateDropMutation();
  const [updateMemberInfo] = useMemberUpdateInfoMutation();
  const [ownerUpdateTotal] = useOwnerUpdateTotalMutation();
  const navigate = useNavigate();

  // Function to add up totals for all added services
  const calculateServiceTotals = () => {
    return addedService.reduce(
      (acc, service) => {
        acc.cash += Number(service.cash);
        acc.credit += Number(service.credit);
        acc.deposit += Number(service.deposit);
        acc.giftCertAmount += Number(service.giftCertAmount);
        return acc;
      },
      { cash: 0, credit: 0, deposit: 0, giftCertAmount: 0 }
    );
  };

  // Totals for display
  const serviceTotals = calculateServiceTotals();
  const total =
    serviceTotals.cash +
    serviceTotals.credit +
    serviceTotals.deposit +
    serviceTotals.giftCertAmount;
  const memberCut = Math.floor(total * 0.6);
  const businessCut = total - memberCut;
  const memberOwes = Math.max(
    0,
    businessCut - (serviceTotals.credit + serviceTotals.giftCertAmount)
  );
  const businessOwes = Math.max(
    0,
    memberCut - (serviceTotals.cash + serviceTotals.deposit)
  );

  // Submit all services to the backend
  const submitServices = async () => {
    try {
      for (const service of addedService) {
        const serviceData = {
          ...service,
          cash: service.cash || 0,
          credit: service.credit || 0,
          deposit: service.deposit || 0,
          giftCertAmount: service.giftCertAmount || 0,
        };
        await createService({ dropId, ...serviceData }).unwrap();
      }
      console.log("All services added successfully");

      // Now update the drop with calculated totals
      await updateDrop({
        dropId,
        date: new Date(date).toISOString(), // assuming the current date; adjust as needed
        total: total,
        memberCut: memberCut,
        businessCut: businessCut,
        memberOwes: memberOwes,
        businessOwes: businessOwes,
      }).unwrap();

      console.log("Sending update request with data:", {
        memberId,
        memberCut,
        memberOwes,
        businessOwes,
      });

      await updateMemberInfo({
        memberId,
        memberCut,
        memberOwes,
        businessOwes,
      }).unwrap();

      console.log("Member information updated successfully");

      await ownerUpdateTotal({ businessCut }).unwrap();

      console.log("Drop updated successfully");
      setAddedService([]); // Clear after submission
      navigate("/memberdashboard");
    } catch (error) {
      console.error("Error adding services:", error);
    }
  };

  return (
    <article className="pageSetup">
      <p>Enter your daily drop</p>
      <form className={styles.dropForm}>
        <label className={styles.labelName}>Date:</label>
        <input
          className={styles.dropFormInput}
          type="date"
          name="drop_date"
          aria-label="drop_date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <ServiceCard
          addedService={addedService}
          setAddedService={setAddedService}
          dropId={dropId}
        />
      </form>
      <section className={styles.totalsSection}>
        <div className={styles.totalServices}>
          <h2>Service Totals:</h2>
          <p>Cash: ${serviceTotals.cash}</p>
          <p>Credit: ${serviceTotals.credit}</p>
          <p>Deposit: ${serviceTotals.deposit}</p>
          <p>Gift Certificate: ${serviceTotals.giftCertAmount}</p>
        </div>
        <div className={styles.dropTotal}>
          <h2>Drop Total:</h2>
          <p>${total}</p>
        </div>
        <div className={styles.percentageTotals}>
          <h2>Your Total:</h2>
          <p>${memberCut}</p>
          <h2>Shop Total:</h2>
          <p>${businessCut}</p>
        </div>
        <div className={styles.cutTotals}>
          <h2>Shop Owes:</h2>
          <p>${businessOwes}</p>
          <h2>You Owe The Shop:</h2>
          <p>${memberOwes}</p>
        </div>
        <button onClick={submitServices}>Submit All Services</button>
      </section>
    </article>
  );
}
