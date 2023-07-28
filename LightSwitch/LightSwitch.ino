int RED_BTN = 16;
int YELLOW_BTN = 5;
int GREEN_BTN = 4;
int RELA = 0;
int RED_LED = 14;
int YELLOW_LED = 12;
int BLUE_LED = 13;
int GREEN_LED = 15;

// เพิ่มตัวแปรเพื่อเก็บสถานะปุ่มแต่ละปุ่ม
int RedbtnState = HIGH;
int YellowbtnState = HIGH;
int GreenbtnState = HIGH;

#include <ESP8266WiFi.h>
#include <PubSubClient.h>

const char* ssid = "SATAVIT_2.4G"; // ชื่อ WiFi ของคุณ
const char* password = "babanook_007"; // รหัสผ่าน WiFi ของคุณ
const char* mqtt_server = "192.168.1.37"; // IP ของ MQTT Broker
const int mqtt_port = 1883; // Port ของ MQTT Broker (ส่วนมากเป็น 1883)

WiFiClient espClient;
PubSubClient client(espClient);

bool subscribed = false; // ตัวแปรเก็บสถานะการ Subscribe

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received [");
  Serial.print(topic);
  Serial.print("] ");

  String msg = "";
  for (int i = 0; i < length; i++) {
    msg += (char)payload[i];
  }
  Serial.println(msg);

  // ตรวจสอบข้อมูลที่เข้ามาใน topic "RED/LED" และทำสิ่งที่คุณต้องการ
  if (String(topic) == "RED/LED") {
    if (msg == "ON") {
      digitalWrite(RED_LED, LOW); // เปิดไฟ LED สีแดง
      client.publish("RED/BTN/STATE", "ON");
    } else if (msg == "OFF") {
      digitalWrite(RED_LED, HIGH); // ปิดไฟ LED สีแดง
      client.publish("RED/BTN/STATE", "OFF");
    }
  }
  else if (String(topic) == "YELLOW/LED") {
        if (msg == "ON") {
      digitalWrite(YELLOW_LED, LOW); // เปิดไฟ LED สีเหลือง
      client.publish("YELLOW/BTN/STATE", "ON");
    } else if (msg == "OFF") {
      digitalWrite(YELLOW_LED, HIGH); // ปิดไฟ LED สีเหลือง
      client.publish("YELLOW/BTN/STATE", "OFF");
    }
  }
  else if (String(topic) == "GREEN/LED") {
        if (msg == "ON") {
      digitalWrite(GREEN_LED, LOW); // เปิดไฟ LED สีเขียว
      client.publish("GREEN/BTN/STATE", "ON");
    } else if (msg == "OFF") {
      digitalWrite(GREEN_LED, HIGH); // ปิดไฟ LED สีเขียว
      client.publish("GREEN/BTN/STATE", "OFF");
    }
  }
  else if (String(topic) == "BLUE/LED") {
        if (msg == "ON") {
      digitalWrite(BLUE_LED, LOW); // เปิดไฟ LED สีน้ำเงิน
      client.publish("BLUE/BTN/STATE", "ON");
    } else if (msg == "OFF") {
      digitalWrite(BLUE_LED, HIGH); // ปิดไฟ LED สีน้ำเงิน
      client.publish("BLUE/BTN/STATE", "OFF");
    }
  }
  else if (String(topic) == "RELAY/STATUS") {
        if (msg == "ON") {
      digitalWrite(RELA, HIGH);
      client.publish("RELAY/STATE", "ON");
    } else if (msg == "OFF") {
      digitalWrite(RELA, LOW);
      client.publish("RELAY/STATE", "OFF");
    }
  }
}

void setup() {
  Serial.begin(9600);
  pinMode(RED_BTN, INPUT);
  pinMode(YELLOW_BTN, INPUT);
  pinMode(GREEN_BTN, INPUT);
  pinMode(RELA, OUTPUT);
  pinMode(RED_LED, OUTPUT);
  pinMode(YELLOW_LED, OUTPUT);
  pinMode(BLUE_LED, OUTPUT);
  pinMode(GREEN_LED, OUTPUT);

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  client.setCallback(callback);
}

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin((char*)ssid, password); // แปลงเป็น char* เพื่อให้สามารถใช้ WiFi.begin() ได้

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    if (client.connect("arduinoClient")) {
      Serial.println("connected");

      // ตรวจสอบสถานะการ Subscribe
      if (!subscribed) {
        client.subscribe("RED/LED"); // ตั้งค่าการ Subscribe ที่ topic "RED/LED"
        client.subscribe("YELLOW/LED"); // ตั้งค่าการ Subscribe ที่ topic "YELLOW/LED"
        client.subscribe("GREEN/LED"); // ตั้งค่าการ Subscribe ที่ topic "GREEN/LED"
        client.subscribe("BLUE/LED"); // ตั้งค่าการ Subscribe ที่ topic "BLUE/LED"
        client.subscribe("RELAY/STATUS"); // ตั้งค่าการ Subscribe ที่ topic "RELAY/STATUS"
        subscribed = true; // กำหนดสถานะการ Subscribe เป็น true เมื่อทำการ Subscribe สำเร็จ
        Serial.println("Subscribed to topic RED/LED"); // แสดงข้อความใน Serial Monitor เมื่อ Subscribe สำเร็จ
        digitalWrite(RELA, HIGH);
        digitalWrite(RED_LED, HIGH); // ปิดไฟ LED สีแดง
        digitalWrite(YELLOW_LED, HIGH); // ปิดไฟ LED สีเหลือง
        digitalWrite(GREEN_LED, HIGH); // ปิดไฟ LED สีเขียว
        digitalWrite(BLUE_LED, HIGH); // ปิดไฟ LED สีน้ำเงิน
      }

    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void loop() {
  // อ่านสถานะปุ่มแต่ละปุ่ม
  RedbtnState = digitalRead(RED_BTN);
  YellowbtnState = digitalRead(YELLOW_BTN);
  GreenbtnState = digitalRead(GREEN_BTN);

  if (!client.connected()) {
    reconnect();
  }
  client.loop();

  // ถ้าปุ่มถูกกด (เมื่อ btnState เป็น LOW)
  if (RedbtnState == LOW) {
    digitalWrite(RED_LED, !digitalRead(RED_LED)); // สลับสถานะ LED
    if (digitalRead(RED_LED) == LOW){
      client.publish("RED/BTN/STATE", "ON");
    }
    else {
      client.publish("RED/BTN/STATE", "OFF");
    }
    delay(250); // หน่วงเวลาสั้น ๆ เพื่อหยุดรับค่าปุ่มเพื่อป้องกันการอ่านรับซ้ำซ้อน
  }
  else if (YellowbtnState == LOW)
  {
    digitalWrite(YELLOW_LED, !digitalRead(YELLOW_LED)); // สลับสถานะ LED
    delay(250); // หน่วงเวลาสั้น ๆ เพื่อหยุดรับค่าปุ่มเพื่อป้องกันการอ่านรับซ้ำซ้อน
  }
  else if (GreenbtnState == LOW)
  {
    digitalWrite(GREEN_LED, !digitalRead(GREEN_LED)); // สลับสถานะ LED
    delay(250); // หน่วงเวลาสั้น ๆ เพื่อหยุดรับค่าปุ่มเพื่อป้องกันการอ่านรับซ้ำซ้อน
  }
}
