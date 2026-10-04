---
title: 'Bringing the elevator "ding" home with Arduino, NFC, and a buzzer'
description: 'My kid loved the elevator chime in our old apartment. A tap-to-play toy built from an Arduino, an RC522 NFC reader, and a passive buzzer.'
pubDate: 2026-10-23T19:00:00+07:00
draft: true
---

<!-- TODO(adwi): hero image. A photo of the rebuilt prototype on a breadboard, or a short video for Instagram. -->

When we lived in an apartment, my kid's favorite part of the day was the elevator. Not the ride itself, but the **ding** when the doors were about to open.

Then we moved into a house. No elevator, no ding.

<!-- TODO(adwi): one concrete memory here, e.g. how your kid reacted to the ding, or asked for it after the move. -->

So I built one.

A quick note before we start: I built this a while ago and the original code and notes are gone. What follows is a reconstruction. The hardware and the approach are what I used, but the code is rewritten from memory, cleaned up for this post.

## The idea

Version 1 was as simple as I could make it: tap a card on a reader, hear a ding.

Version 2 came later: every tap plays the next tune in a short playlist, then loops back to the start.

## The hardware

- **Arduino.** <!-- TODO(adwi): Uno or Nano? -->
- **RC522 NFC reader.** A cheap 13.56 MHz module that talks SPI. It runs on **3.3 V**, not 5 V.
- **Passive buzzer.**
- A few NFC cards or tags. <!-- TODO(adwi): dedicated tags, or did any card work, e.g. a transit or e-money card? -->

The buzzer type matters more than anything else on this list. An **active** buzzer has its own oscillator and makes one fixed tone when you power it. A **passive** buzzer makes whatever frequency you drive it at. A ding needs two pitches, and a tune needs many, so it has to be passive.

Wiring for an Uno with the common MFRC522 library:

| RC522 | Arduino Uno |
|---|---|
| SDA (SS) | D10 |
| SCK | D13 |
| MOSI | D11 |
| MISO | D12 |
| RST | D9 |
| 3.3V | 3.3V |
| GND | GND |

The buzzer goes between D8 and GND.

## `tone()` is only half of music

Arduino's `tone(pin, frequency)` makes a square wave at a given frequency. That gives you pitch. But a melody also needs **rhythm**: how long each note lasts, and the gaps between them. `tone()` doesn't know anything about that, so you have to build it yourself.

Here's the model I used.

**Tempo becomes milliseconds.** At a given BPM (beats per minute), one beat lasts `60000 / BPM` milliseconds. In 4/4 time a beat is a quarter note, so at 120 BPM a quarter note is 500 ms.

**Note lengths are fractions of that.** A whole note is 4 beats, a half note 2, a quarter note 1, an eighth note half a beat. A dotted note is 1.5 times its normal length.

**Notes need a gap.** If you play a note for its full length, two identical notes in a row blur into one long note. Sounding each note for about 90% of its length and staying silent for the rest makes them distinct.

**A rest is just silence.** Frequency 0 means "wait this long without sound."

**`tone()` doesn't wait.** Given a duration, `tone()` starts the sound and returns immediately. Without a `delay()` afterwards, the next note cuts off the current one.

All of that fits in one function:

```cpp
const int BPM = 120;
const unsigned long BEAT_MS = 60000UL / BPM;  // one beat = a quarter note in 4/4

// div: 4 = quarter, 8 = eighth, 2 = half. Negative means dotted.
void playNote(int freq, int div) {
  unsigned long ms = (BEAT_MS * 4) / abs(div);
  if (div < 0) ms = ms * 3 / 2;
  if (freq > 0) tone(BUZZER_PIN, freq, ms * 9 / 10);  // 90% sound, 10% gap
  delay(ms);
}
```

## Making the ding

An elevator chime is usually two notes, the second lower than the first. I used E5 then C5: a short note followed by a longer one.

<!-- TODO(adwi): if you remember the actual notes or timing you used, use those instead. -->

```cpp
const Note DING[] = { {NOTE_E5, 4}, {NOTE_C5, 2} };
```

The frequencies come from the standard tuning, where A4 is 440 Hz and every semitone multiplies the frequency by the twelfth root of two. In terms of MIDI note numbers, that's `f = 440 × 2^((n − 69) / 12)`. That's also where the numbers in Arduino's `pitches.h` come from. Mine weren't real MIDI files, just arrays of frequencies and lengths.

A buzzer can't make a real chime, though. A bell rings and then fades. A buzzer is either on or off, at full volume, with a harsh square wave. Picking the right note lengths and the gap between the two notes does most of the work of making it read as a ding anyway.

## Version 2: a playlist

Each tune is an array of notes, and the sketch keeps an index of which one plays next:

```cpp
#include <SPI.h>
#include <MFRC522.h>

const byte SS_PIN = 10;
const byte RST_PIN = 9;
const byte BUZZER_PIN = 8;

#define REST    0
#define NOTE_C5 523
#define NOTE_D5 587
#define NOTE_E5 659
#define NOTE_F5 698
#define NOTE_G5 784
#define NOTE_A5 880

struct Note { int freq; int div; };
struct Song { const Note* notes; byte length; };
#define SONG(arr) { arr, sizeof(arr) / sizeof(arr[0]) }

const Note DING[] = { {NOTE_E5, 4}, {NOTE_C5, 2} };
const Note TWINKLE[] = {
  {NOTE_C5, 4}, {NOTE_C5, 4}, {NOTE_G5, 4}, {NOTE_G5, 4},
  {NOTE_A5, 4}, {NOTE_A5, 4}, {NOTE_G5, 2},
};

const Song SONGS[] = { SONG(DING), SONG(TWINKLE) };
const byte SONG_COUNT = sizeof(SONGS) / sizeof(SONGS[0]);

const int BPM = 120;
const unsigned long BEAT_MS = 60000UL / BPM;

MFRC522 rfid(SS_PIN, RST_PIN);
byte current = 0;

void playNote(int freq, int div) {
  unsigned long ms = (BEAT_MS * 4) / abs(div);
  if (div < 0) ms = ms * 3 / 2;
  if (freq > 0) tone(BUZZER_PIN, freq, ms * 9 / 10);
  delay(ms);
}

void playSong(const Song& song) {
  for (byte i = 0; i < song.length; i++) {
    playNote(song.notes[i].freq, song.notes[i].div);
  }
}

void setup() {
  SPI.begin();
  rfid.PCD_Init();
}

void loop() {
  if (!rfid.PICC_IsNewCardPresent() || !rfid.PICC_ReadCardSerial()) return;

  playSong(SONGS[current]);
  current = (current + 1) % SONG_COUNT;

  rfid.PICC_HaltA();
}
```

<!-- TODO(adwi): which tunes were in your playlist? Swap them in for TWINKLE. -->

## Deliberately simple

This was a toy for a small kid, so I built the simplest version that worked. A few limits fall straight out of that:

- **`delay()` blocks everything.** While a tune plays, the Arduino isn't reading the card reader, so a tap in the middle of a song is missed. Fixing that means replacing `delay()` with a timer-based loop that checks `millis()`.
- **The playlist position lives in RAM.** Unplug it and it starts from the first tune again. Saving the index to EEPROM would fix that.
- **No volume, no fade.** A passive buzzer can't do either. For real sound, a DFPlayer Mini module with a small speaker can play actual audio files.

None of those mattered to the person it was built for.

<!-- TODO(adwi): close with what your kid did with it, or whether it still gets used. -->

## If I build version 3

- Swap the buzzer for a DFPlayer Mini and play a real recorded chime.
- Give each card its own sound, so a card becomes a "floor" button.
- Replace `delay()` with non-blocking playback so a new tap can interrupt a song.
