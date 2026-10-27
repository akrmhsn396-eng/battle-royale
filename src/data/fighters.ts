import { Fighter } from '../types';

export const DEFAULT_FIGHTERS: Fighter[] = [
  {
    id: 'ryu-master',
    name: 'Kenshin "The Dragon" Ryu',
    title: 'Wandering Martial Arts Master',
    element: 'Fire / Spirit',
    health: 100,
    attackPower: 75,
    speed: 80,
    specialMoveName: 'Hadoken Burst',
    specialMoveDesc: 'Channels concentrated spirit energy into a blazing projectile.',
    bio: 'A lifelong disciple of the ancient crimson fist style seeking true inner mastery across global arcade tournaments.',
    image: '/src/assets/images/fighter_ryu_master_1793132396068.jpg',
    color: 'from-red-600 to-amber-500',
  },
  {
    id: 'cyber-ninja',
    name: 'Kage-Ryu X',
    title: 'Neon Cyber Assassin',
    element: 'Lightning / Tech',
    health: 100,
    attackPower: 85,
    speed: 95,
    specialMoveName: 'Plasma Blade Slash',
    specialMoveDesc: 'A lightning-fast dash attack leaving glowing blue afterimages.',
    bio: 'Augmented with experimental neural cybernetics, Kage-Ryu moves at hypersonic speeds through Tokyo neon alleyways.',
    image: '/src/assets/images/fighter_cyber_ninja_1793132396611.jpg',
    color: 'from-cyan-600 to-blue-500',
  },
  {
    id: 'mecha-bot',
    name: 'Breacher-07',
    title: 'Heavy Assault Combat Mecha',
    element: 'Iron / Plasma',
    health: 100,
    attackPower: 90,
    speed: 60,
    specialMoveName: 'Hydraulic Slam',
    specialMoveDesc: 'Slams the ground with reinforced steel fists creating a shockwave.',
    bio: 'Built for industrial demolition and re-purposed for underground combat arenas. Unstoppable momentum.',
    image: '/src/assets/images/fighter_mecha_bot_1793132397044.jpg',
    color: 'from-amber-700 to-zinc-600',
  },
];

export const KIVY_PROJECT_FILES = {
  'main.py': `from kivy.app import App
from kivy.uix.boxlayout import BoxLayout
from kivy.uix.button import Button
from kivy.uix.label import Label
from kivy.uix.widget import Widget
from kivy.graphics import Color, Rectangle
from kivy.clock import Clock
from kivy.properties import NumericProperty, StringProperty
from kivy.core.window import Window

# ============================================================
# عالم اليمن: معركة الصحراء
# لعبة قتال 2D بسيطة على الهاتف
# ============================================================

WORLD_WIDTH = 500
WORLD_HEIGHT = 560

class Fighter:
    def __init__(self, x, y, w, h, color, name, facing="right"):
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.color = color
        self.name = name
        self.facing = facing
        self.health = 100
        self.max_health = 100
        self.is_attacking = False
        self.attack_timer = 0
        self.is_blocking = False
        self.block_timer = 0
        self.velocity_y = 0
        self.on_ground = True

    def rect(self):
        return [self.x, self.y, self.w, self.h]

    def move_left(self):
        self.x -= 18
        self.facing = "left"

    def move_right(self):
        self.x += 18
        self.facing = "right"

    def jump(self):
        if self.on_ground:
            self.velocity_y = 260
            self.on_ground = False

    def attack(self):
        if not self.is_attacking:
            self.is_attacking = True
            self.attack_timer = 0.28

    def block(self):
        if not self.is_blocking:
            self.is_blocking = True
            self.block_timer = 0.25

    def take_damage(self, amount):
        if self.is_blocking:
            amount = int(amount * 0.35)
        self.health = max(0, self.health - amount)

    def update(self, dt):
        if self.attack_timer > 0:
            self.attack_timer -= dt
            if self.attack_timer <= 0:
                self.is_attacking = False

        if self.block_timer > 0:
            self.block_timer -= dt
            if self.block_timer <= 0:
                self.is_blocking = False

        if not self.on_ground:
            self.velocity_y -= 650 * dt
            self.y += self.velocity_y * dt
            if self.y <= 0:
                self.y = 0
                self.velocity_y = 0
                self.on_ground = True
        else:
            self.y = 0

    def reset(self, x):
        self.x = x
        self.y = 0
        self.health = self.max_health
        self.is_attacking = False
        self.attack_timer = 0
        self.is_blocking = False
        self.block_timer = 0
        self.velocity_y = 0
        self.on_ground = True


def intersects(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    return not (
        ax + aw < bx or bx + bw < ax or ay + ah < by or by + bh < ay
    )


class GameArea(Widget):
    winner_text = StringProperty("")
    player_health = NumericProperty(100)
    enemy_health = NumericProperty(100)

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.player = Fighter(70, 0, 72, 120, (0, 120, 255, 1), "اللاعب")
        self.enemy = Fighter(350, 0, 72, 120, (235, 80, 50, 1), "العدو")
        self.winner_text = ""
        self.player_health = self.player.health
        self.enemy_health = self.enemy.health

    def reset_game(self):
        self.player.reset(70)
        self.enemy.reset(350)
        self.winner_text = ""
        self.player_health = 100
        self.enemy_health = 100

    def update(self, dt):
        if self.winner_text != "":
            return

        if self.player.x < self.enemy.x:
            self.enemy.x -= 2.5
        elif self.player.x > self.enemy.x:
            self.enemy.x += 2.5

        if abs(self.player.x - self.enemy.x) < 160 and self.enemy.on_ground:
            if int(self.player.x) % 7 == 0:
                self.enemy.jump()

        if abs(self.player.x - self.enemy.x) < 110 and not self.enemy.is_attacking:
            if int(self.player.x) % 5 == 0:
                self.enemy.attack()

        self.player.update(dt)
        self.enemy.update(dt)

        self.player.x = max(0, min(self.player.x, WORLD_WIDTH - self.player.w))
        self.enemy.x = max(0, min(self.enemy.x, WORLD_WIDTH - self.enemy.w))

        if self.player.is_attacking:
            if self.player.facing == "right":
                hitbox = [self.player.x + self.player.w, self.player.y, 60, self.player.h]
            else:
                hitbox = [self.player.x - 60, self.player.y, 60, self.player.h]
            if intersects(hitbox, self.enemy.rect()):
                self.enemy.take_damage(12)

        if self.enemy.is_attacking:
            if self.enemy.facing == "right":
                hitbox = [self.enemy.x + self.enemy.w, self.enemy.y, 60, self.enemy.h]
            else:
                hitbox = [self.enemy.x - 60, self.enemy.y, 60, self.enemy.h]
            if intersects(hitbox, self.player.rect()):
                self.player.take_damage(12)

        self.player_health = self.player.health
        self.enemy_health = self.enemy.health

        if self.player.health <= 0:
            self.winner_text = "الفائز: العدو"
        elif self.enemy.health <= 0:
            self.winner_text = "الفائز: أنت"

    def on_touch_down(self, touch):
        if touch.x < self.width / 2:
            self.player.move_left()
        else:
            self.player.move_right()

        if touch.y > self.height * 0.55:
            self.player.jump()

    def draw_scene(self):
        self.canvas.clear()
        with self.canvas:
            Color(0.95, 0.82, 0.52, 1)
            Rectangle(pos=(0, 0), size=(self.width, self.height))

            Color(0.72, 0.55, 0.35, 1)
            Rectangle(pos=(0, self.height * 0.68), size=(self.width, self.height * 0.32))

            Color(0.68, 0.52, 0.24, 1)
            Rectangle(pos=(0, 0), size=(self.width, 80))

            Color(0.8, 0.8, 0.8, 1)
            Rectangle(pos=(20, self.height - 35), size=(180, 18))
            Color(0.26, 0.78, 0.27, 1)
            Rectangle(pos=(20, self.height - 35), size=(180 * (self.player.health / self.player.max_health), 18))

            Color(0.8, 0.8, 0.8, 1)
            Rectangle(pos=(self.width - 200, self.height - 35), size=(180, 18))
            Color(0.81, 0.25, 0.25, 1)
            Rectangle(pos=(self.width - 200, self.height - 35), size=(180 * (self.enemy.health / self.enemy.max_health), 18))

            Color(*self.player.color)
            Rectangle(pos=(self.player.x, self.player.y), size=(self.player.w, self.player.h))

            Color(*self.enemy.color)
            Rectangle(pos=(self.enemy.x, self.enemy.y), size=(self.enemy.w, self.enemy.h))

            if self.player.is_attacking:
                Color(1, 1, 0, 0.8)
                if self.player.facing == "right":
                    Rectangle(pos=(self.player.x + self.player.w, self.player.y + 20), size=(60, 80))
                else:
                    Rectangle(pos=(self.player.x - 60, self.player.y + 20), size=(60, 80))

            if self.enemy.is_attacking:
                Color(1, 1, 0, 0.8)
                if self.enemy.facing == "right":
                    Rectangle(pos=(self.enemy.x + self.enemy.w, self.enemy.y + 20), size=(60, 80))
                else:
                    Rectangle(pos=(self.enemy.x - 60, self.enemy.y + 20), size=(60, 80))

    def render(self):
        self.draw_scene()


class GameRoot(BoxLayout):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.orientation = "vertical"
        self.spacing = 6
        self.padding = [10, 10, 10, 10]

        self.title_label = Label(
            text="عالم اليمن: معركة الصحراء",
            font_size="24sp",
            bold=True,
            color=(0.2, 0.1, 0.05, 1),
            size_hint=(1, 0.12)
        )
        self.add_widget(self.title_label)

        self.hud = BoxLayout(size_hint=(1, 0.08), spacing=10)
        self.player_label = Label(text="اللاعب: 100", font_size="18sp", color=(0, 0, 0, 1))
        self.status_label = Label(text="حارب!", font_size="18sp", color=(0, 0, 0, 1))
        self.enemy_label = Label(text="العدو: 100", font_size="18sp", color=(0, 0, 0, 1))
        self.hud.add_widget(self.player_label)
        self.hud.add_widget(self.status_label)
        self.hud.add_widget(self.enemy_label)
        self.add_widget(self.hud)

        self.game_area = GameArea(size_hint=(1, 0.7))
        self.add_widget(self.game_area)

        self.controls = BoxLayout(size_hint=(1, 0.12), spacing=5)
        self.left_btn = Button(text="يسار")
        self.right_btn = Button(text="يمين")
        self.jump_btn = Button(text="قفز")
        self.attack_btn = Button(text="ضربة")
        self.block_btn = Button(text="دفاع")
        self.reset_btn = Button(text="إعادة")

        self.left_btn.bind(on_press=self.move_left)
        self.right_btn.bind(on_press=self.move_right)
        self.jump_btn.bind(on_press=self.jump)
        self.attack_btn.bind(on_press=self.attack)
        self.block_btn.bind(on_press=self.block)
        self.reset_btn.bind(on_press=self.reset)

        self.controls.add_widget(self.left_btn)
        self.controls.add_widget(self.right_btn)
        self.controls.add_widget(self.jump_btn)
        self.controls.add_widget(self.attack_btn)
        self.controls.add_widget(self.block_btn)
        self.controls.add_widget(self.reset_btn)

        self.add_widget(self.controls)

        Clock.schedule_interval(self.update, 1 / 60)

    def update(self, dt):
        self.game_area.update(dt)
        self.game_area.render()

        self.player_label.text = f"اللاعب: {int(self.game_area.player.health)}"
        self.enemy_label.text = f"العدو: {int(self.game_area.enemy.health)}"

        if self.game_area.winner_text:
            self.status_label.text = self.game_area.winner_text
        else:
            self.status_label.text = "حارب!"

    def move_left(self, instance):
        self.game_area.player.move_left()

    def move_right(self, instance):
        self.game_area.player.move_right()

    def jump(self, instance):
        self.game_area.player.jump()

    def attack(self, instance):
        self.game_area.player.attack()

    def block(self, instance):
        self.game_area.player.block()

    def reset(self, instance):
        self.game_area.reset_game()
        self.status_label.text = "حارب!"


class YemenBattleApp(App):
    def build(self):
        return GameRoot()


if __name__ == "__main__":
    YemenBattleApp().run()
`,
  'buildozer.spec': `[app]

# (str) Title of your application
title = YemenBattle

# (str) Package name
package.name = yemenbattle

# (str) Package domain (needed for android/ios packaging)
package.domain = com.example

# (str) Source code where the main.py live
source.dir = .

# (list) Source files to include
source.include_exts = py,png,jpg,kv,atlas,wav,mp3

# (str) Application version
version = 0.1

# (list) Required packages
requirements = python3,kivy

# (str) Supported orientation
orientation = portrait

# (bool) fullscreen
fullscreen = 0

# (list) permissions
android.permissions = INTERNET

# (int) Target Android API
android.api = 31

# (int) Minimum API
android.minapi = 21

# (str) Android NDK version
android.ndk = 25b

# (str) Android SDK version
android.sdk = 24

# (bool) Enable AndroidX support
android.enable_androidx = True

# (str) Android archs
android.archs = arm64-v8a

[buildozer]
log_level = 2
warn_on_root = 1
`,
  'requirements.txt': `kivy
buildozer
`,
  'README.md': "# Yemen Battle Game\\n\\nلعبة قتال 2D بسيطة مستوحاة من مشهد عربي/يمني، مبنية باستخدام Python و Kivy.\\n\\n## التشغيل على الكمبيوتر\\n\`\`\`bash\\npython3 -m venv venv\\nsource venv/bin/activate\\npip install -r requirements.txt\\npython3 main.py\\n\`\`\`\\n",
};
