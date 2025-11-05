import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

// 🔥 Fetch only active (non-expired) bookings
export const fetchActiveBookings = async () => {
  const now = Date.now();
  const q = query(collection(db, "bookings"), where("expiresAt", ">", now));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};
