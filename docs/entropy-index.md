# Entropy Quality Index
_Determines the defensive quality of a binary's entropy on a scale of [0, 100]_

## Definition of Entropy Quality Index

```
EQI = percentageOfDeadGadgets + (numberOfOffsets / numberOfMovedGadgets) * 100 * (1 - (standardDeviation(offsets)/highest_offset_count));
```

## Entropy Quality Index as a measure of resiliency to attacks
In order to approximately compare efficacy of ROP/symbol relocation entropy in a
binary, we must normalize the entropy on a one-dimensional scale.

While entropy is certainly not one-dimensional, the "cost of attack",
or "probability of attack" can certainly be.

## Axiomatic Bounds

This gives us two intuitive bounds for this Entropy Index.

* If an attack is guaranteed to work with on two binaries, with no modification or adaptiation to the attack,
  the entropy index is zero. WannaCry and Petya fall under this category. Literally the exact same
  code could spread laterally and be assured to run.

* If an attack is guaranteed to not work on a two binaries no matter what
  modifications or adaptations are are made to the attack, then that is an Entropy Index of 100. The defense
  was a 100% effective under all forms of a particular attack.

## Terminology

Let us consider a binary is made up of "gadgets", bits and pieces of code
that work together to form a complete program. These are a sequence of instructions
at a particular given address.

* We have one _original_ and one _modified_ binary. Call them A and B.

* A Gadget _survives_ if it appears at the same location in both A and B.

* A Gadget has _moved_ if appears in both A and B, but not at the same location. It is possible
for there to be a different number of moved gadgets in B, than those existed in A. Conceretely:
```
moved(A, B) is not equal to moved(B, A)
```

* New Gadget: A Gadget is _new_ if it appears in B but not at any location in A. That is, it was brand new to B.

* Dead Gadget: A Gadget is _dead_ if it appears in A but not at any location in B. That is, it neither survived nor moved.

* Offset of Moved Gadgets: The distance between the address of a moved gadget in
  B, and the nearest address at which the same gadget is found
  in A. We fully recognize that this definition can be improved.
  Some gadgets may have actually moved farther and the nearest-gadget
  may be coming from a different part of the program.

## EQI is not commutative
  EQI is the entropy produced in B, given that A has existed. Therefore, the EQI(A, B) is not the same
  as EQI(B, A).

## Deriving the formula

This is how I derived the formula:

* If 100% gadgets survive, we have an entropy index of 0. No modification is
  required for the attack.

* If 100% gadgets died, the chances of attack are nearly zero (the probability
  can tend to zero, but will never be zero.) However for practical purposes,
  the metric is a scale, and we can take this to be zero.

* These two conditions give us a basic linear formula first:
  ```
  EQI = dead_percent;
  ```

  If a 100% of gadgets are dead, EQI is 100. If 100% gadgets survived, EQI is 0.
  This is fine. Dead and Surviving gadgets are mutually exclusive.

* All non-dead gadgets now fall into two categories: "moved" and "survived".
  Anything survived is a liability.

  We can scale the moved gadgets on a Movement Quality Index [0, 100].

  We then scale the percentage of moved gadgets by MQI, getting an "effective
  percentage of moved gadgets".

  For example: If 50% gadgets died, 50% moved, and none survived, then we
  measure the quality of movement on a scale of 0-100. Suppose we got 65% on
  that scale. We then apply that multiplier to the original 50% of moved gadgets
  to get effective percentage: 50 * 0.65 = 32.5

  EQI = 50% (dead gadgets) + 32.5% effective movement = 82.5!

* There are many ways to measure quality of movement. This is a TODO.

  For the moment we can at least agree that two numbers are certainly necessary, if not
  sufficient to describe movement quality:

  * The number of different offsets with which gadgets are moved (e.g. 50% of the
    gadgets were moved by one byte, and the remaining 50% by 2 bytes., then
    the number of different offsets is 2.) The higher numbers of offsets, the better.

    Ideally you would have a different offset for each gadget. This effectively
    makes predicting the location of one gadget impossible knowing the location
    of any other. Let us assign this a case (cwf: "case" looks like a typo, but I'm not sure what you meant) of 100.

    Let us scale this between 0-100 by computing number of offsets as a
    percentage of number of gadgets (which ensures us there were that many
    distinct addresses even available within the binary.)

    ```
    movementScale = (numberOfOffsets / numberOfMovedGadgets * 100)
    ```

    (In the future, we will apply a deeper scale that measures the quality of
      offsets themselves. Out of scope for a moment.)

  * Uniformity metric of gadgets spread across offsets. If there were 100 offsets,
    and 90% gadgets fell into only one offset, then detecting the offset of
    that gadget determines the offset of 90% of the others.

    For this we simply use standard deviation scaled between [0, 1] by dividing it
    with the highest count at an offset, but since we want uniformity,
    we'll subtract the standard deviation from it.

  * The movement quality is therefore measured as:
  ```
    MQ  = (numberOfOffsets / numberOfMovedGadgets) * 100 * (1 - (standardDeviation(offsets)/highest_offset_count));
  ```
