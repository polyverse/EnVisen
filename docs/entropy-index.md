# Entropy Quality Index
_Determines the defensive quality of a binary's entropy on a scale of [0, 100]_

## Definition of Entropy Quality Index

```
EQI = percentageOfDeadGadgets + (numberOfOffsets / numberOfMovedGadgets) * 100 * (1 - standardDeviation(offsets));
```

## Entropy Quality Index as a measure of resiliency to attacks
In order to truly compare efficacy of ROP/symbol relocation entropy in a
binary, we must first find a way to normalize the entropy on a one-dimensional
scale on a number line.

While entropy is in itself perhaps not one-dimensional, the "cost of attack",
or "probability of attack" can certainly be looked at in this manner.

Given two attack methods, we can safely put them on a number line where
either they are both equal, or one is easier than the other.

## Axions

Let's begin with the two bounding conditions for this Entropy Index.
These definitions are brutally functional, so rather than talk about all the
cool things we do to the binary, we talk about the difficulty for attack.

* If an attack is guaranteed to work with NO modification on a binary,
  the entropy index is zero. This means there was ZERO by way of efficacy.
  WannaCry and Petya fall under this category. Literally the exact same
  code could spread laterally and be assured to run.

* If an attack is guaranteed to not work on a modified binary no matter what
  modifications are made, then that is an Entropy Index of 100. The defense
  was a 100% effective under all forms of a particular attack.

## Terminology

Let us consider a binary is made up of "gadgets", bits and pieces of code
that work together to form a complete program. These may be instructions,
dispatch tables, relocation tables, system calls, interrupts, and more.

* Original Binary: The base of comparison.

* Modified Binary: The binary being compared to the base.

* Dead Gadget: A Gadget is considered dead if it appears in
  the modified binary, but not the source binary.

* Moved Gadget: A Gadget is considered moved, it if appears in both the binaries,
  but the address in the Modified Binary does not contain the same gadget in the Base.
  It is possible for there to be a different number of moved gadgets between binaries.

  For example, "gad1" may appear at locations [1, 2, 3] in Base, but [5, 6, 7, 8, 9]
  in the Modified. All five gadgets are considered "moved", because at least one
  instance was found in the original.

* Surviving Gadgets: A Gadget is considered survived, if it appears at
  the same location in both the binaries.

* Offset of Moved Gadgets: The distance between the address of a moved gadget in
  the Modified Binary, and the nearest address at which the same gadget is found
  in the Base Binary. We fully recognize that this definition can be improved.
  Some gadgets may have actually moved farther and the nearest-gadget
  may be coming from a different part of the program.


## Low-hanging conclusions

Let's write some low-hanging predicates here:

* If 100% gadgets survive, we have an entropy index of 0. No modification is
  required for the attack.

* If 0% gadgets survive, the chances of attack are nearly zero (the probability
  can tend to zero, but will never be zero.) However for practical purposes,
  the metric is a scale, and we can take this to be zero.

* These two conditions give us a basic linear formula first:
  ```
  EQI = dead_percent;
  ```

  If a 100% of gadgets are dead, EQI is 100. If 100% gadgets survived, EQI is 0.
  This is fine.

* All non-dead gadgets now fall into two categories: "moved" and "survived".
  Let us ignore the survived. We can now scale the moved gadgets between [0, 100],
  and we can then convert that scale to the total percentage, getting weighted percentage.

  For example: If 50% gadgets died, 50% moved, and none survived, then we
  measure the quality of movement on a scale of 0-100. Suppose we got 65% on
  that scale. We then apply that multiplier to the original 50% of moved gadgets
  to get: 50 * 0.65 = 32.5

  Overall EQI = 50% (dead gadgets) + 32.5% movement quality = 82.5!

* There are many ways to measure quality of movement. For the moment,
  we can at least agree that two numbers are certainly necessary, if not
  sufficient to describe movement quality:

  * The number of different offsets with which gadgets are moved (e.g. 50% of the
    gadgets were moved by one byte, and the remaining 50% by 2 bytes.) The more
    numbers of offsets, the better. Ideally you would have a different offset
    for each gadget. This effectively makes predicting the location of one gadget
    impossible based on the location of any other. The cost of finding a gadget
    stays constant for each gadget. Let us assign this a case of 100.

    Let us scale this between 0-100 by computing number of offsets as a
    percentage of number of gadgets (which ensures us there were that many
    distinct addresses even available within the binary.)

    ```
    movementScale = (numberOfOffsets / numberOfMovedGadgets * 100)
    ```

    (In the future, we will apply a deeper scale that measures the quality of
      offsets themselves. Out of scope for a moment.)

  * Uniformity of gadgets spread across offsets. If there were 100 offsets,
    and 90% gadgets fell into only one offset, then detecting the offset of
    that gadget determines the offset of 90% of the others.

    For this we simply use standard deviation scaled between [0, 1] by dividing it
    with the highest count at an offset, but since we want more uniformity,
    we'll subtract the standard deviation from it.

  * The movement quality is therefore measured as:
  ```
    MQ  = (numberOfOffsets / numberOfMovedGadgets) * 100 * (1 - standardDeviation(offsets));
  ```
