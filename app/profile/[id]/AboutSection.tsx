export default function AboutSection({
    aboutMeText // *0.1
}: { aboutMeText: string }) {
    return (
        <section className="ProfAS__Section" >
            <h3>About</h3>
            <p>{aboutMeText}</p>
        </section >
    )
}

{/*
    
## Idea

This section displays the value of the profile's property aboutMe. The only reason why it's
a separate component despite it's simplicity is the fact that it's out of bounds of the
DataSection proper. Just to take it out of the way from the DataSection component.

## Structure

- 1. Section
- 1.1. Header
- 1.2. Paragraph with the aboutMe text (comes from profileData)

## Known uses of this component

- components/DataSection/DataSection

## More comments

- 0.1. Props
  - aboutMeText = profileData.aboutMe. It's the value saved under the property aboutMe in
  user objects.
    
*/}