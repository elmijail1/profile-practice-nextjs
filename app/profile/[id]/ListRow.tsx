"use client";
import Link from "next/link";

type LOFProps = {
    user: any,
    listOrder?: number,
    self?: boolean,
    deleteOnClick?: any,
    extraActionOnClick?: any,
    textColor?: string
}

export default function ListRow({
    user, listOrder = 0, self = false, deleteOnClick = undefined, extraActionOnClick = undefined, textColor = "0, 0%, 100%"
}: LOFProps) {
    // *0.1

    return (

        // 1. List item
        <li className={self ? "LR__GenSelf" : "LR__Gen"}>

            {/* 1.1. Profile Representation */}
            <Link
                href={`/profile/${user.id}`}
                className={deleteOnClick ? "LR__LinkClipped" : "LR__Link"}
                onClick={extraActionOnClick ? extraActionOnClick : undefined}
                style={{ color: `hsl(${textColor})` }}
            >
                <div className="LR__ListOrder">{listOrder}</div>
                <div
                    className="LR__ProfileImage"
                    style={{ backgroundColor: user.bgColor }}
                >
                    {user.emoji}
                </div>
                <div className="LR__ProfileName">{user.name}</div>
            </Link>

            {/* 1.2. Delete Button */}
            {
                deleteOnClick &&
                <button
                    className="LR__DeleteButton"
                    onClick={() => deleteOnClick(user.id)}
                >
                    +
                </button>
            }
        </li>
    )
}

{/*
DOCUMENTATION
-
IDEA
Displays a single list row in profile lists.
-
STRUCTURE
1. List item
1.1. Profile representation
1.2. Delete button
.
The list item (1) is a wrapper element containing both the profile representation (1.1)
and the delete button (3) if it's required.
-
KNOWN USES:
1. pages/People (a list item on its main list)
2. pages/Profile (a list item on its friend list)
-
COMMENTS
0.1. Props
There are 5 props total, 4 of them are optional:
- 1. user – an object containing user data. It's expected to contain the following
properties: id, name, emoji, bgColor. For examples, visit ../data/usersData. This
data is used to fill the profile representation (2): it displays the name & the image.
As for the id, it's used to generate a link to the profile.
- 2. listOrder – it shows the order of the item in the list. Most often it's determined
by the index of the user object in its data array + 1. If no index is specified, it's
going to be 0.
- 3. self – used in pages/People only. It's used to highlight your own profile on the
list if you're logged in.
- 4. deleteOnClick – used in pages/Profile only. It's used to activate the delete
button (3) element as well as several special styles.
- 5. extraActionOnClick – used in pages/Profile only. It's used to hide the friend list
window upon clicking on one of the profiles. Without it the state doesn't reset and
the window remains open although you've navigated to another profile page.
- 6. textColor – applies to the profile name and the row's number.
.
.
.
1. List item
- A wrapper element for the profile representation (2) and the delete button (3);
- It has a conditional className: if the ListRow represents the profile identical to
the one that's currently logged in by the user, the text inside it is colored differently
to make it clear that it's your profile among others.
.
1.1. Profile Representation
- It displays a profile's info: name, image, and the order number under the current
sorting method;
- It also contains the link to the related profile page;
- The className is conditional: if the List item (1) features a Delete button (3) the
names get clipped to keep the delete buttons at one vertical line.
.
1.2. Delete Button
- It's only present when the deleteOnClick prop is passed. The prop contains the deletion
function that the button uses. It's practical use is removing friends from your
friend list.
*/}