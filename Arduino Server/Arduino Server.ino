const int POTEN_PIN = A0;
const int TRIG_PIN = 3;
const int ECHO_PIN = 2;

int potenValue = 0;
int previousPotenValue = potenValue;

int dist = 0;
long t = 0;
float vel = 0.034;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);

  pinMode(POTEN_PIN, INPUT);
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  potenValue = map(analogRead(POTEN_PIN), 0, 1023, 100, 0);

  if (potenValue != previousPotenValue) {
    sendMessage(potenValue, dist);
    previousPotenValue = potenValue;
  }  

  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);


  t = pulseIn(ECHO_PIN, HIGH);
  dist = vel * (t / 2);

  if (dist > 50) {
    sendMessage(potenValue, dist);
  }
}

void sendMessage(int potenValue, float dist) {
  Serial.print(potenValue);
  Serial.print(" ");
  Serial.print(dist);
  Serial.println();
}