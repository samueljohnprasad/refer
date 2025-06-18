import { StyleSheet } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { getShadow } from "../utils/styleUtils";

export const useCardStyles = () => {
    const { theme } = useTheme();

    return StyleSheet.create({
        container: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            marginVertical: theme.spacing.sm,
            ...getShadow(theme, "sm"),
        },
        elevated: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.md,
            padding: theme.spacing.md,
            marginVertical: theme.spacing.md,
            ...getShadow(theme, "md"),
        },
        flat: {
            backgroundColor: theme.colors.card,
            borderRadius: theme.borderRadius.sm,
            padding: theme.spacing.md,
            marginVertical: theme.spacing.sm,
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        header: {
            marginBottom: theme.spacing.sm,
        },
        footer: {
            marginTop: theme.spacing.sm,
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
        },
        content: {
            flex: 1,
        },
        title: {
            fontSize: theme.typography.fontSize.lg,
            fontWeight: "bold",
            color: theme.colors.text,
            marginBottom: theme.spacing.xs,
        },
        subtitle: {
            fontSize: theme.typography.fontSize.sm,
            color: theme.mode === "dark" ? theme.colors.text : "#666",
            marginBottom: theme.spacing.sm,
        },
    });
};

export default useCardStyles;
