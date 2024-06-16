# Extract Course Transcripts

This is a tool to extract all the transcripts from a Udemy course.

## How to use
1. On your favorite browser ~~except IE, who likes this~~, navigate to the course you wish to extract the transcripts from.
2. Click on the `Course content` tab and click on the lesson you want to start from (e.g. click on the first lesson to extract all transcripts, from start to end).
3. Open the browser's developer tools.
4. Paste the script in the `Console` tab.
5. Wait for the script to complete. Go grab a coffee as it may take a while :)
6. Save the results file when prompted.

The script will navigate through eash lesson and extract the transcripts. At the end, it will prompt you to save a `json` file with the results. The results are in the following format:

```json
[
    {
        "sectionTitle": "...",
        "sectionNumber": 1,
        "lessonTitle": "...",
        "lessonNumber": 1,
        "transcript": "..."
    }
]
```

# Notes
- Beware that this script will skip quizzes that are not yet done!
- This script does NOT extract lesson resources, nor the text from text-based lessons.
- Unfortunatelly this script is based on an **Advanced Shitty Scripting (A.S.S.)** technique in which the function to extract the transcript educately tries to execute from time to time. The ideal time depends on several factors, including your internet speed. Please adjust the `TIME_TO_WAIT` variable if the script gets stuck.