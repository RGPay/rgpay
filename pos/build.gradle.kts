plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.kotlin.kapt) apply false
    alias(libs.plugins.hilt) apply false
}

tasks.register("runDebug") {
    group = "app"
    description = "Build + Install + Run Debug APK"

    doLast {
        println("✅ App instalado com sucesso!")
        println("📱 Para executar no emulador:")
        println("   adb shell am start -n com.rgpay.pos/.MainActivity")
        println("💡 Ou abra manualmente no emulador/dispositivo")
    }
}

tasks.register("runAdb") {
    group = "app"
    description = "Executa o APP em um dispositivo Android via ADB"
    
    doLast {
        exec { commandLine("adb", "shell", "am", "start", "-n", "com.rgpay.pos/.MainActivity") }
        println("✅ App executado com sucesso!")
    }
}
