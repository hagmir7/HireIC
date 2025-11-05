// ResumeSearch.jsx
import React, { useState, useRef, useCallback } from "react";
import { Input, Spin } from "antd";
import { SearchIcon } from "lucide-react";

export default function ResumeSearch({ onSearch, delay = 400 }) {
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const timerRef = useRef(null);

    const triggerSearch = useCallback(
        (q) => {
            setLoading(true);
            Promise.resolve(onSearch ? onSearch(q) : console.log("search:", q))
                .finally(() => setLoading(false));
        },
        [onSearch]
    );

    const handleChange = (e) => {
        const next = e.target.value;
        setValue(next);

        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => {
            triggerSearch(next);
        }, delay);
    };

    const handleSearchNow = (q) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        triggerSearch(q);
    };

    return (
        <div className="flex gap-4 items-center" style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Input
                placeholder="Rechercher un CV..."
                value={value}
                onChange={handleChange}
                onSearch={handleSearchNow}
                allowClear
                suffix={
                    loading ? (
                        <Spin size="small" className="text-gray-400" />
                    ) : (
                        <SearchIcon size={16} className="text-gray-400" />
                    )
                }
            />
        </div>
    );
}
