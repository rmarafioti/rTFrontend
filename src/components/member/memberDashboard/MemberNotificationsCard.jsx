import { useGetMemberQuery } from "../../../features/members/membersSlice";

export default function MemberNotificationsCard() {
  const { data: member, error, isLoading } = useGetMemberQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Extract all unique paidDrops from the member's drops
  const paidDrops = member.drop
    ?.filter((drop) => drop.paidDrop)
    .map((drop) => drop.paidDrop)
    .filter(
      (value, index, self) =>
        self.findIndex((pd) => pd.id === value.id) === index
    );

  return (
    <section>
      <h3>Payment Notifications:</h3>
      {paidDrops?.length ? (
        paidDrops.map((paidDrop) => (
          <div key={paidDrop.id}>
            <h4>Payment Received:</h4>
            <p>
              ${paidDrop.amount} from {paidDrop.payee} on{" "}
              {new Date(paidDrop.paidDate).toLocaleDateString("en-US", {
                timeZone: "UTC",
              })}
            </p>
            <p>{paidDrop.paidMessage || "No message provided"}</p>

            {/* Map over the drops associated with this paidDrop */}
            <h5>Paid for Drops on:</h5>
            <ul>
              {member.drop
                ?.filter((drop) => drop.paidDrop?.id === paidDrop.id)
                .map((drop) => (
                  <li key={drop.id}>
                    {new Date(drop.date).toLocaleDateString("en-US", {
                      timeZone: "UTC",
                    })}
                  </li>
                ))}
            </ul>
          </div>
        ))
      ) : (
        <p>No payment notifications yet.</p>
      )}
    </section>
  );
}
