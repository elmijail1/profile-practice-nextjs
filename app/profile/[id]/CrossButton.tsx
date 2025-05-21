export default function CrossButton({ onClickAction }: any) {
    return (
        <button
            className="text-[hsl(0,_0%,_70%)] text-[3rem] bg-none border-none [rotate:45deg] absolute top-[0] right-[0] w-12 h-12 flex justify-center items-center"
            onClick={onClickAction}
        >
            +
        </button>
    )
}