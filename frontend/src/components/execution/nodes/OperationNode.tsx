import { motion } from "framer-motion";
import { Handle, Position, type NodeProps } from "reactflow";
import {
    Database,
    Funnel,
    GitMerge,
    Boxes,
    Sigma,
    ArrowDownWideNarrow,
    Scissors,
    CircleCheckBig,
    HelpCircle,
} from "lucide-react";

type NodeKind =
    | "table"
    | "filter"
    | "join"
    | "group"
    | "aggregate"
    | "sort"
    | "limit"
    | "result"
    | "select";

interface OperationNodeData {
    title: string;
    value: string;

    // Reserved for future timeline synchronization
    active?: boolean;
    completed?: boolean;
}

const CONFIG: Record<
    string,
    {
        icon: React.ElementType;
        border: string;
        bg: string;
        iconColor: string;
    }
> = {
    table: {
        icon: Database,
        border: "border-blue-500",
        bg: "bg-blue-50",
        iconColor: "text-blue-600",
    },

    filter: {
        icon: Funnel,
        border: "border-yellow-500",
        bg: "bg-yellow-50",
        iconColor: "text-yellow-600",
    },

    join: {
        icon: GitMerge,
        border: "border-purple-500",
        bg: "bg-purple-50",
        iconColor: "text-purple-600",
    },
    select: {
        icon: Database,
        border: "border-cyan-500",
        bg: "bg-cyan-50",
        iconColor: "text-cyan-600",
    },

    group: {
        icon: Boxes,
        border: "border-emerald-500",
        bg: "bg-emerald-50",
        iconColor: "text-emerald-600",
    },

    aggregate: {
        icon: Sigma,
        border: "border-red-500",
        bg: "bg-red-50",
        iconColor: "text-red-600",
    },

    sort: {
        icon: ArrowDownWideNarrow,
        border: "border-indigo-500",
        bg: "bg-indigo-50",
        iconColor: "text-indigo-600",
    },

    limit: {
        icon: Scissors,
        border: "border-gray-500",
        bg: "bg-gray-50",
        iconColor: "text-gray-600",
    },

    result: {
        icon: CircleCheckBig,
        border: "border-green-500",
        bg: "bg-green-50",
        iconColor: "text-green-600",
    },
};

export default function OperationNode({
    data,
    type,
}: NodeProps<OperationNodeData>) {

    const config =
        CONFIG[type as NodeKind] ?? {
            icon: HelpCircle,
            border: "border-slate-400",
            bg: "bg-slate-50",
            iconColor: "text-slate-600",
        };

    const Icon = config.icon;

    const isActive = data.active ?? false;
    const isCompleted = data.completed ?? false;

    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.95,
            }}
            animate={{
                opacity: 1,
                scale: isActive ? 1.05 : 1,
            }}
            transition={{
                duration: 0.25,
            }}
            className={`
                min-w-[260px]
                rounded-xl
                border-2
                ${config.border}
                ${
                    isCompleted
                        ? "ring-2 ring-green-400"
                        : ""
                }
                ${
                    isActive
                        ? "ring-4 ring-blue-400 shadow-2xl"
                        : "shadow-md"
                }
                bg-white
                transition-all
                duration-300
                hover:shadow-xl
                hover:scale-105
            `}
        >
            <Handle
                type="target"
                position={Position.Top}
            />

            <div
                className={`
                    flex
                    items-center
                    gap-2
                    px-4
                    py-3
                    border-b
                    ${config.bg}
                    rounded-t-xl
                `}
            >
                <Icon
                    size={18}
                    className={config.iconColor}
                />

                <span className="font-semibold flex-1">
                    {data.title}
                </span>

                {isCompleted && (
                    <CircleCheckBig
                        size={16}
                        className="text-green-600"
                    />
                )}
            </div>

            <div
                className="
                    px-4
                    py-3
                    text-sm
                    whitespace-pre-wrap
                    break-words
                    text-slate-700
                    max-h-44
                    overflow-auto
                "
            >
                {data.value}
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
            />
        </motion.div>
    );
}