export default function AboutSection({
    aboutMeText // *0.1
}: { aboutMeText: string }) {
    return (
        <section className="w-4/5 flex flex-col items-center gap-2 mt-[1.3rem]" >
            <h3>About</h3>
            <p>{aboutMeText}</p>
        </section >
    )
}