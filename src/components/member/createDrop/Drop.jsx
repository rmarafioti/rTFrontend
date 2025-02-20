import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceCard from "./ServiceCard";
import {
  useGetMemberQuery,
  useMemberCreateDropMutation,
  useMemberCreateServiceMutation,
  useMemberUpdateDropMutation,
} from "../../../features/members/membersSlice";
import styles from "../../../styling/member/createdrop.module.css";

export default function Drop({ dropId }) {
  const [createDrop] = useMemberCreateDropMutation();

  const { data: member } = useGetMemberQuery();
  const memberId = member?.id;

  const [addedService, setAddedService] = useState([]);
  const [date, setDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [createService] = useMemberCreateServiceMutation();
  const [updateDrop] = useMemberUpdateDropMutation();
  const navigate = useNavigate();

  const handleSetAddedService = useCallback((newServices) => {
    setAddedService(newServices);
  }, []);

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

  // Submit all services
  const submitServices = async () => {
    try {
      if (!date.trim()) {
        setErrorMessage("Please enter a date for your drop.");
        return;
      }

      const newDrop = await createDrop().unwrap();

      if (!newDrop?.id) {
        console.error("Drop creation failed");
        return;
      }

      const dropId = newDrop.id;

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
        date: new Date(date).toISOString(),
        total: total,
        memberCut: memberCut,
        businessCut: businessCut,
        memberOwes: Math.max(
          0,
          businessCut - (serviceTotals.credit + serviceTotals.giftCertAmount)
        ),
        businessOwes: Math.max(
          0,
          memberCut - (serviceTotals.cash + serviceTotals.deposit)
        ),
      }).unwrap();

      console.log("Drop updated successfully");
      setAddedService([]);
      navigate("/memberdashboard");
    } catch (error) {
      console.error("Error adding services:", error);
    }
  };

  return (
    <>
      <form className={styles.dropForm}>
        <label className={styles.labelName}>Enter date of drop: </label>
        <input
          className={styles.dropFormInput}
          type="date"
          name="drop_date"
          aria-label="drop_date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </form>
      <ServiceCard
        addedService={addedService}
        setAddedService={handleSetAddedService}
        dropId={dropId}
      />
      <article className={styles.dropPage}>
        <section className={styles.totalsSection}>
          <div className={styles.totalServices}>
            <h2 className={styles.serviceTotalsHeader}>Service Totals:</h2>
            <div className={styles.serviceItemSection}>
              <p className={styles.serviceItem}>Cash:</p>
              <p className={styles.serviceItem}> ${serviceTotals.cash}</p>
            </div>
            <div className={styles.serviceItemSection}>
              <p className={styles.serviceItem}>Credit:</p>
              <p className={styles.serviceItem}> ${serviceTotals.credit}</p>
            </div>
            <div className={styles.serviceItemSection}>
              <p className={styles.serviceItem}>Deposit:</p>
              <p className={styles.serviceItem}> ${serviceTotals.deposit}</p>
            </div>
            <div
              className={styles.serviceItemSection}
              id={styles.bottomServiceSection}
            >
              <p className={styles.serviceItem}>Gift Certificate:</p>
              <p className={styles.serviceItem}>
                {" "}
                ${serviceTotals.giftCertAmount}
              </p>
            </div>
          </div>
          <div className={styles.totalDrop}>
            <div className={styles.dropTotal}>
              <p className={styles.dropTotalsHeader}>Drop Total:</p>
              <p className={styles.dropTotalsHeader}>${total}</p>
            </div>
            <div className={styles.percentageTotals}>
              <p className={styles.dropItem}>Your Total:</p>
              <p className={styles.dropItem}>${memberCut}</p>
            </div>
            <div className={styles.percentageTotals}>
              <p className={styles.dropItem}>Shop Total:</p>
              <p className={styles.dropItem}>${businessCut}</p>
            </div>
            <div className={styles.cutTotals}>
              <p className={styles.dropItem}>Shop Owes:</p>
              <p className={styles.dropItem}>${businessOwes}</p>
            </div>
            <div className={styles.cutTotals} id={styles.bottomCutTotals}>
              <p className={styles.dropItem}>You Owe The Shop:</p>
              <p className={styles.dropItem}>${memberOwes}</p>
            </div>
          </div>
        </section>
        <button className={styles.submitDropButton} onClick={submitServices}>
          Submit Daily Drop
        </button>
        {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
      </article>
    </>
  );
}
