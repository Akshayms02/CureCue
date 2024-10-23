// cronJobs.js
import cron from "node-cron";
import Slot from "../models/doctorSlotsModel"; // Adjust the path to your Slot model

// Cron job runs every minute
cron.schedule("* * * * *", async () => {
  console.log("Checking for expired held slots...");

  const currentTime = new Date();

  try {
    // Find all slots where holdExpiresAt has passed
    const expiredSlots = await Slot.find({
      "timeSlots.isOnHold": true,
      "timeSlots.holdExpiresAt": { $lt: currentTime },
    });

    for (const slot of expiredSlots) {
      // Loop through all time slots in the document and release those that are expired
      slot.timeSlots.forEach(async (timeSlot) => {
        if (
          timeSlot.isOnHold &&
          timeSlot.holdExpiresAt &&
          timeSlot?.holdExpiresAt < currentTime
        ) {
          // Release the slot
          await Slot.releaseSlot(slot.doctorId, slot.date, timeSlot.start);
          console.log(
            `Released slot for doctorId: ${slot.doctorId}, start: ${timeSlot.start}`
          );
        }
      });
    }
  } catch (error) {
    console.error("Error releasing expired slots:", error);
  }
});
