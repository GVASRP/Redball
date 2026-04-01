using UnityEngine;

public class PlayerController : MonoBehaviour
{
    public float moveSpeed = 5f;
    public float jumpForce = 7f;
    public Rigidbody2D rb;
    public LayerMask groundLayer;
    public Transform groundCheck;

    private bool isGrounded;
    private float moveInput;

    void Update()
    {
        // Получаем ввод (на телефоне это будут кнопки, на ПК — стрелочки)
        moveInput = Input.GetAxisRaw("Horizontal");

        // Прыжок
        isGrounded = Physics2D.OverlapCircle(groundCheck.position, 0.2f, groundLayer);
        
        if (Input.GetButtonDown("Jump") && isGrounded)
        {
            rb.velocity = new Vector2(rb.velocity.x, jumpForce);
        }
    }

    void FixedUpdate()
    {
        // Движение и вращение (эффект качения)
        rb.velocity = new Vector2(moveInput * moveSpeed, rb.velocity.y);
        
        if (moveInput != 0) {
            rb.AddTorque(-moveInput * 2f); // Добавляем крутящий момент для реалистичности
        }
    }
}
