import { useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import { toast } from "react-toastify";

export default function Report() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [loading, setLoading] = useState(false);

    const downloadPDF = async () => {
        if (!from || !to) return toast.error("Select both dates");

        try {
            setLoading(true);

            const res = await api.get(`/api/report/pdf?from=${from}&to=${to}`, {
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `report_${from}_to_${to}.pdf`);
            document.body.appendChild(link);
            link.click();

            toast.success("PDF downloaded ✅");
        } catch (error) {
            toast.error(error.response?.data?.message || "PDF generation failed ❌");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">Generate PDF Report</h2>

                <div className="flex gap-4 mb-6">
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                    <input
                        type="date"
                        className="border p-2 rounded"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                </div>

                <button
                    onClick={downloadPDF}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
                >
                    {loading ? "Generating..." : "Download PDF"}
                </button>
            </div>
        </>
    );
}
