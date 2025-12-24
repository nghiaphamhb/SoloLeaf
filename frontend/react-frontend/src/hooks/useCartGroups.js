import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCartItems, selectCartInitialPrice } from "../store/cartSelector";

export function useCartGroups() {
    const items = useSelector(selectCartItems);
    const total = useSelector(selectCartInitialPrice);

    const groups = useMemo(() => {
        const g = {};
        for (const it of items) {
            const rid = String(it.restId ?? "UNKNOWN"); // restaurant's id
            if (!g[rid]) g[rid] = { name: it.restName ?? "UNKNOWN", items: [] };
            g[rid].items.push(it);
        }
        return g;
    }, [items]);

    // [resId1, resId2, ...]
    const restIds = useMemo(() => Object.keys(groups), [groups]);

    // helpers
    const isEmpty = items.length === 0;

    const firstRestId = items[0]?.restId ?? null;

    return { items, total, groups, restIds, isEmpty, firstRestId };
}
