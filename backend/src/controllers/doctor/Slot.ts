import { Request, Response } from "express";
import { ISlotService } from "../../interfaces/doctor/Slot.service.interface";


export class SlotController {
    private SlotService: ISlotService;
    constructor(SlotService: ISlotService) {
        this.SlotService = SlotService
    }
    async scheduleSlots(req: Request, res: Response): Promise<void> {
        try {
            const { date, timeSlots, doctorId } = req.body;
            if (!doctorId || !date || !timeSlots || timeSlots.length === 0) {
                res
                    .status(400)
                    .json({ message: "Doctor ID, date, and time slots are required." });
            }
            const response = await this.SlotService.scheduleSlot(
                date,
                timeSlots,
                doctorId
            );

            if (response) {
                res.status(200).json({
                    message: "Successful",
                });
            } else {
                res.status(500).json({ message: "Something went wrong" });
            }
        } catch (error: any) {
            if (error instanceof Error) {
                if (error.message == "Some of the slots here are already scheduled") {
                    res.status(409).json({
                        message: "Some of the requested slots are already scheduled.",
                    });
                } else {
                    res.status(500).json({ message: "Internal Server Error" });
                }
            }
        }
    }

    async checkAvialableSlots(req: Request, res: Response): Promise<void> {
        try {
            const { doctorId, date } = req.query;

            const response = await this.SlotService.checkSlots(
                doctorId as string,
                date as string
            );

            if (response) {
                res.status(200).json(response);
            }
        } catch (error: any) {
            if (error instanceof Error) {
                if (error.message === "No slots on this date Exists") {
                    res.status(204).json({ message: "No slots found" });
                } else {
                    res.status(500).json({ message: "Internal Server Error" });
                }
            }
        }
    }

    async checkAvialability(req: Request, res: Response): Promise<void> {
        const { doctorId, date, start, end } = req.body;
        if (!doctorId || !date || !start || !end) {
            res.status(400).json({ error: "Missing required fields" });
        }

        try {
            const response = await this.SlotService.checkAvialability(
                doctorId as string,
                date as string,
                start as string,
                end as string
            );
            if (response) {
                res.status(200).json(response);
            }
        } catch (error: any) {
            if (error instanceof Error) {
                console.log(error);
                res.status(500).json({ message: "Internal server Error" });
            }
        }
    }

    async deleteSlot(req: Request, res: Response): Promise<void> {
        try {
            const { start, doctorId, date } = req.body;
            console.log(date);
            const response = await this.SlotService.deleteSlot(
                start as string,
                doctorId as string,
                date as string
            );
            if (response) {
                res.status(200).json({ message: "Slot successfully deleted" });
            }
        } catch (error: any) {
            if (error instanceof Error) {
                console.log(error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

    async checkStatus(req: Request, res: Response): Promise<void> {
        try {
            const { email } = req.params;
            const response = await this.SlotService.checkStatus(email as string);

            res.status(200).json(response);
        } catch (error: any) {
            if (error instanceof Error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

}