type Timestamp = number; // Timestamps in milliseconds since Unix epoch

export class RtcAccuracyHelper {
  private static initTimestamp: Date = new Date(0); // Epoch time
  private static correctionFactor: number = 1;

  public static calculateCorrectionFactor(
    initTimestamp: Date,
    finalTimestamp: Date,
  ): void {
    this.initTimestamp = initTimestamp;

    if (finalTimestamp > initTimestamp && new Date() > initTimestamp) {
      const worldSec = (new Date().getTime() - initTimestamp.getTime()) / 1000;
      const islandSec =
        (finalTimestamp.getTime() - initTimestamp.getTime()) / 1000;

      this.correctionFactor = worldSec / islandSec;
    } else {
      this.correctionFactor = 1;
    }
  }

  public static correctedTimestamp(timestamp: Date): Date {
    let correctedTimestamp = new Date(timestamp);

    if (timestamp > this.initTimestamp) {
      const delta =
        ((timestamp.getTime() - this.initTimestamp.getTime()) / 1000) *
        this.correctionFactor;
      correctedTimestamp = new Date(
        this.initTimestamp.getTime() + delta * 1000,
      );
    }

    return correctedTimestamp;
  }

  public static correctedLocalTimestamp(timestamp: Date): Date {
    const correctedLocalTimestamp = this.correctedTimestamp(timestamp);
    return new Date(
      correctedLocalTimestamp.getTime() +
        correctedLocalTimestamp.getTimezoneOffset() * 60000,
    );
  }

  public static correctedTimestampWithFactor(
    initTimestamp: Date,
    timestamp: Date,
    correctionFactor: number,
  ): Date {
    let correctedTimestamp = new Date(timestamp);

    if (timestamp > initTimestamp) {
      const delta =
        ((timestamp.getTime() - initTimestamp.getTime()) / 1000) *
        correctionFactor;
      correctedTimestamp = new Date(initTimestamp.getTime() + delta * 1000);
    }

    return correctedTimestamp;
  }

  public static correctedLocalTimestampWithFactor(
    initTimestamp: Date,
    timestamp: Date,
    correctionFactor: number,
  ): Date {
    const correctedLocalTimestamp = this.correctedTimestampWithFactor(
      initTimestamp,
      timestamp,
      correctionFactor,
    );
    return new Date(
      correctedLocalTimestamp.getTime() +
        correctedLocalTimestamp.getTimezoneOffset() * 60000,
    );
  }

  public static correctedTimeSpan(timeSpan: number): number {
    const correctedTimeSpan = timeSpan * this.correctionFactor;
    return correctedTimeSpan;
  }

  public static getDrift(): number {
    return (1 - this.correctionFactor) * 100;
  }
}

export default RtcAccuracyHelper;
