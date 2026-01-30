import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { getPlaygroundById, SaveUpdatedCode } from "../actions";

export const usePlayground = (id) => {
    const [playgroundData, setPlaygroundData] = useState(null);
    const [templateData, setTemplateData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadPlayground = useCallback(async () => {
        if (!id) return;

        try {
            setIsLoading(true);
            setError(null);

            const data = await getPlaygroundById(id);
            setPlaygroundData(data);

            const res = await fetch(`/api/template/${id}`);
            if (!res.ok) {
                throw new Error(`Failed to load template: ${res.status}`);
            }

            const { templateJson } = await res.json();
            setTemplateData(templateJson);

            toast.success("Playground loaded successfully");
        } catch (err) {
            console.error("Error loading playground:", err);
            setError("Failed to load playground data");
            toast.error("Failed to load playground data");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    const saveTemplateData = useCallback(
        async (data) => {
            try {
                await SaveUpdatedCode(id, data);
                setTemplateData(data);
                toast.success("Changes saved successfully");
            } catch (err) {
                console.error("Error saving template data:", err);
                toast.error("Failed to save changes");
                throw err;
            }
        },
        [id]
    );

    useEffect(() => {
        loadPlayground();
    }, [loadPlayground]);

    return {
        playgroundData,
        templateData,
        isLoading,
        error,
        loadPlayground,
        saveTemplateData,
    };
};
