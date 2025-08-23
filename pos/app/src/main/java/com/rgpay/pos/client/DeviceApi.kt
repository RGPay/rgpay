package com.rgpay.pos.client

import com.rgpay.pos.errors.DeviceAlreadyAssignedError
import com.rgpay.pos.errors.DeviceNotAssignedError
import com.rgpay.pos.errors.DeviceNotFoundError
import kotlinx.coroutines.delay

// Data class equivalente ao TypeScript DeviceMetadata
data class DeviceMetadata(
    val serialId: String,
    val deviceName: String,
    val operationalSystem: String = "android",
    var assigned: Boolean = false
)

class DeviceApiClient {

    // Mock database
    private val devices = mutableListOf(
        DeviceMetadata(serialId = "EMULATOR36X1X9X0", deviceName = "sdk_gphone64_arm64")
    )

    // Simula GET /device/{serialId}
    suspend fun getDevice(serialId: String): DeviceMetadata {
        println("Getting device: $serialId")
        delay(2000) // simula rede

        val device = devices.find { it.serialId == serialId }
            ?: throw DeviceNotFoundError("Dispositivo não encontrado")

        return device
    }

    // Simula PUT /device/{serialId}/assignments
    suspend fun assignDevice(serialId: String): DeviceMetadata {
        println("Assigning device: $serialId")
        delay(1500) // simula rede

        val index = devices.indexOfFirst { it.serialId == serialId }
        if (index == -1) throw DeviceNotFoundError("Dispositivo não encontrado")

        val device = devices[index]

        if (device.assigned) throw DeviceAlreadyAssignedError("Dispositivo já está ativo")

        // Atualiza estado
        device.assigned = true
        devices[index] = device

        return device
    }

    // Simula login POST
    suspend fun login(serialId: String): String {
        println("Logging in: $serialId")
        delay(1000) // simula rede

        val device = devices.find { it.serialId == serialId }
            ?: throw DeviceNotFoundError("Dispositivo não encontrado")

        if (!device.assigned) throw DeviceNotAssignedError("Dispositivo não está registrado")

        // Retorna token fake
        return "jwt_${device.serialId}"
    }
}
