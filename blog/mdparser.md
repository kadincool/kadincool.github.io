# how I made a markdown parser
## By Kadin

> How hard could it be? - me last week. 

So... Markdown; The sister of markup languages like HTML. Pretty easy to type in, hence why places like Discord, Reddit, and forums use it.

And thus why I wanted to use it on this blog, so I got to work.

At the surface it seems like turning Markdown into Markup would be simple. turn the \#s into \<h1>s, turn the \*s into \<i>s.

***I wish.***

## Chapter 1: first steps

One idea I initally had was to use RegEx to split based on 2 \\n line breaks however, like with a lot of markdown, theres an edge case where a shortcut wont work, namely `code segments` and **especially** code blocks.

***

```
/------------------------\
| Chapter 2: Code Blocks |
\------------------------/
```

***

Just to show how everything is expressed the EXACT way it is in text, heres the same text outside and inside the code block

\<h1> \*hello\*   \<--that was just 3 spaces **WHAT**

```
\<h1> \*hello\*   \<--that was just 3 spaces **WHAT**
```

*EVERYTHING* is expressed as-is, nothing exept 3 ticks breaks out of it, and even that needs to be on its own line.

Basically: Every rule will be broken.

So... what is one to do?

## Chapter 3: conditionals and modularity

